import {LazyMotion, domAnimation, m, useAnimation} from "framer-motion";
import {useEffect, useState, type ImgHTMLAttributes} from "react";

const animationVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
};

export const FadeInImage = (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const animationControls = useAnimation();

    useEffect(() => {
        if (isLoaded) {
            animationControls.start("visible");
        }
    }, [isLoaded]);

    return (
        <LazyMotion features={domAnimation}>
            <m.div
                animate={animationControls}
                initial="hidden"
                transition={{duration: 0.5, ease: "easeOut"}}
                variants={animationVariants}
                className="h-full w-full"
            >
                <img
                    // Make sure the image fills and covers the container
                    className="h-full w-full object-cover"
                    {...props}
                    onLoad={() => setIsLoaded(true)}
                    alt={props.alt ?? "background"}
                />
            </m.div>
        </LazyMotion>
    );
};

export default FadeInImage;