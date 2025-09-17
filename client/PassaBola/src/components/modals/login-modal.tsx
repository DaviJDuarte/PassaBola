import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/config/api.ts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
};

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignup,
}: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  function validateNow(values = { email, password }) {
    const next: typeof errors = {};

    if (!values.email.trim()) next.email = "Email é obrigatório.";
    if (!values.password.trim()) next.password = "Senha é obrigatória.";

    return next;
  }

  function validateAndSet() {
    const next = validateNow();

    setErrors((prev) => ({
      ...prev,
      email: next.email,
      password: next.password,
    }));

    return Object.keys(next).length === 0;
  }

  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    if (!validateAndSet()) return;

    setLoading(true);
    try {
      const { data } = await api.post<{ access_token: string; role: string }>(
        "/auth/login",
        {
          email,
          password,
        },
      );

      if (!data?.access_token) {
        throw new Error("Credenciais inválidas");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("admin", data.role);

      if (data.role === "admin") {
        navigate("/admin", { replace: true });
      }

      if (data.role === "user") {
        navigate("/app", { replace: true });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível entrar. Tente novamente.";

      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    setAttemptedSubmit(false);
    setTouched({});
    onClose();
  };

  // Determine invalid state from current value + validation attempt or touch
  const emailError =
    !email.trim() && (attemptedSubmit || touched.email)
      ? "Email é obrigatório."
      : errors.email;
  const passwordError =
    !password.trim() && (attemptedSubmit || touched.password)
      ? "Senha é obrigatória."
      : errors.password;

  return (
    <Modal
      hideCloseButton={loading}
      isOpen={isOpen}
      placement="center"
      size="md"
      onOpenChange={(open: boolean) => {
        if (!open) closeAndReset();
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Entrar</ModalHeader>
            <ModalBody>
              {errors.general && (
                <div className="text-sm text-red-600" role="alert">
                  {errors.general}
                </div>
              )}
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  errorMessage={emailError}
                  isInvalid={!!emailError}
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, email: true }));
                    if (!email.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "Email é obrigatório.",
                      }));
                    }
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setEmail(v);
                    // Clear general error while typing
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    // If the value is now valid, clear field error
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
                <Input
                  isRequired
                  errorMessage={passwordError}
                  isInvalid={!!passwordError}
                  label="Senha"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, password: true }));
                    if (!password.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "Senha é obrigatória.",
                      }));
                    }
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setPassword(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <div className="flex items-center justify-between text-sm">
                  <button
                    className="text-default-500 hover:underline"
                    type="button"
                    onClick={() => {
                      /* TODO: Esquecer a senha */
                    }}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-2 sm:flex-row justify-between items-center">
              <div className="w-full text-center text-sm text-default-500 sm:w-auto sm:text-left">
                Não tem conta?{" "}
                <button
                  className="font-medium hover:underline"
                  type="button"
                  onClick={onSwitchToSignup}
                >
                  Criar conta
                </button>
              </div>
              <div>
                <Button
                  isDisabled={loading}
                  variant="light"
                  onPress={closeAndReset}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-default-foreground text-background"
                  isLoading={loading}
                  onPress={handleSubmit}
                >
                  Entrar
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
