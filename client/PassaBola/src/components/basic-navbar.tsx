import { Button } from "@heroui/button";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarProps,
} from "@heroui/navbar";
import { forwardRef, useState } from "react";
import { cn } from "@heroui/theme";
import { Icon } from "@iconify/react";

import LoginModal from "./modals/login-modal";
import SignupModal from "./modals/signup-modal";

const BasicNavbar = forwardRef<HTMLElement, NavbarProps>(
  ({ classNames = {}, ...props }, ref) => {
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
          base: cn("border border-purple-300/40 bg-transparent", {
            "bg-purple-600/90 dark:bg-purple-700/90": isMenuOpen,
          }),
          wrapper: "w-full justify-center",
          item: "hidden md:flex",
          ...classNames,
        }}
        height="60px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <div className="rounded-full bg-purple-600 text-white" />
          <span className="ml-2 text-small font-medium text-purple-800">
            Passa a Bola
          </span>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem className="ml-2 flex! gap-2">
            <Button
              className="text-purple-700"
              radius="full"
              variant="light"
              onPress={openLogin}
            >
              Entrar
            </Button>
            <Button
              className="bg-purple-600 text-white font-medium hover:bg-purple-700"
              endContent={<Icon icon="solar:alt-arrow-right-linear" />}
              radius="full"
              variant="flat"
              onPress={openSignup}
            >
              Criar conta
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenuToggle
          className={cn(
            "md:hidden",
            isMenuOpen ? "text-white" : "text-purple-700",
          )}
        />

        <NavbarMenu
          className={cn(
            "top-[calc(var(--navbar-height)-1px)] max-h-fit pt-6 pb-6 backdrop-blur-md backdrop-saturate-150 shadow-medium",
            isMenuOpen
              ? "bg-purple-600/90 text-white"
              : "bg-purple-50 text-purple-800",
          )}
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
        >
          <NavbarMenuItem>
            <Button
              fullWidth
              className="border border-purple-300 text-purple-800"
              variant="faded"
              onPress={() => {
                setIsMenuOpen(false);
                openLogin();
              }}
            >
              Entrar
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              fullWidth
              className="bg-purple-600 text-white hover:bg-purple-700"
              onPress={() => {
                setIsMenuOpen(false);
                openSignup();
              }}
            >
              Criar conta
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>

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
