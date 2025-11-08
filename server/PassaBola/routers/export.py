import csv
import io

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from core.dependencies import get_current_user
from db.database import get_db
from models.user import User
from models.match import Match
from models.user_match import UserMatch

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/match/{match_id}/players/csv")
def export_match_players_csv(
        match_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    try:
        match = db.query(Match).filter(Match.id == match_id).first()
        if not match:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )

        user_matches = (
            db.query(UserMatch, User)
            .join(User, UserMatch.user_id == User.id)
            .filter(UserMatch.match_id == match_id)
            .all()
        )

        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            "Name",
            "Email",
            "Phone Number",
            "Document",
            "Position",
            "Birth Date",
            "Team",
            "Status"
        ])

        for user_match, user in user_matches:
            writer.writerow([
                user.name,
                user.email,
                user.phone_number or "",
                user.document or "",
                user.position or "",
                user.birth_date.strftime("%Y-%m-%d") if user.birth_date else "",
                user_match.team or "",
                "Confirmed" if user_match.confirmed else "Pending"
            ])

        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=match_{match_id}_players.csv"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export match players: {str(e)}"
        )
