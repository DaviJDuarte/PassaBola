import {Button} from "@heroui/button";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem, NavbarProps,
} from "@heroui/navbar";
import {forwardRef, useState} from "react";
import {cn} from "@heroui/theme";
import {Icon} from "@iconify/react";
import LoginModal from "./modals/login-modal";
import SignupModal from "./modals/signup-modal";

const BasicNavbar = forwardRef<HTMLElement, NavbarProps>(
    ({classNames = {}, ...props}, ref) => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [isLoginOpen, setIsLoginOpen] = useState(false);
        const [isSignupOpen, setIsSignupOpen] = useState(false);

        const openLogin = () => setIsLoginOpen(true);
        const openSignup = () => setIsSignupOpen(true);
        const closeLogin = () => setIsLoginOpen(false);
        const closeSignup = () => setIsSignupOpen(false);

        return (
            <Navbar
                ref={ref}
                {...props}
                classNames={{
                    base: cn("border-default-100 bg-transparent", {
                        "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
                    }),
                    wrapper: "w-full justify-center",
                    item: "hidden md:flex",
                    ...classNames,
                }}
                height="60px"
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
            >
                {/* Left Content */}
                <NavbarBrand>
                    <div className="bg-default-foreground text-background rounded-full">

                    </div>
                    <span className="text-small text-default-foreground ml-2 font-medium">Passa a Bola</span>
                </NavbarBrand>

                {/* Center Content */}

                {/* Right Content */}
                <NavbarContent className="hidden md:flex" justify="end">
                    <NavbarItem className="ml-2 flex! gap-2">
                        <Button className="text-default-500" radius="full" variant="light" onPress={openLogin}>
                            Entrar
                        </Button>
                        <Button
                            className="bg-default-foreground text-background font-medium"
                            color="secondary"
                            endContent={<Icon icon="solar:alt-arrow-right-linear"/>}
                            radius="full"
                            variant="flat"
                            onPress={openSignup}
                        >
                            Criar conta
                        </Button>
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenuToggle className="text-default-400 md:hidden"/>

                <NavbarMenu
                    className="bg-default-200/50 shadow-medium dark:bg-default-100/50 top-[calc(var(--navbar-height)-1px)] max-h-fit pt-6 pb-6 backdrop-blur-md backdrop-saturate-150"
                    motionProps={{
                        initial: {opacity: 0, y: -20},
                        animate: {opacity: 1, y: 0},
                        exit: {opacity: 0, y: -20},
                        transition: {
                            ease: "easeInOut",
                            duration: 0.2,
                        },
                    }}
                >
                    <NavbarMenuItem>
                        <Button fullWidth variant="faded" onPress={() => { setIsMenuOpen(false); openLogin(); }}>
                            Entrar
                        </Button>
                    </NavbarMenuItem>
                    <NavbarMenuItem className="mb-4">
                        <Button fullWidth className="bg-foreground text-background" onPress={() => { setIsMenuOpen(false); openSignup(); }}>
                            Criar conta
                        </Button>
                    </NavbarMenuItem>
                </NavbarMenu>

                {/* Modals */}
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={closeLogin}
                    onSwitchToSignup={() => {
                        closeLogin();
                        openSignup();
                    }}
                />
                <SignupModal
                    isOpen={isSignupOpen}
                    onClose={closeSignup}
                    onSwitchToLogin={() => {
                        closeSignup();
                        openLogin();
                    }}
                />
            </Navbar>
        );
    },
);

BasicNavbar.displayName = "BasicNavbar";

export default BasicNavbar;