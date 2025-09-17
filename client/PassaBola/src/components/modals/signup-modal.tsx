import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

import api from "@/config/api.ts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  phone_number?: string;
  document?: string;
  birth_date?: string;
  position?: string;
  general?: string;
};

const POSITION_OPTIONS = [
  { value: "", label: "Selecione uma posição (opcional)" },
  { value: "goleira", label: "Goleira" },
  { value: "zagueira", label: "Zagueira" },
  { value: "lateral", label: "Lateral" },
  { value: "meio-campo", label: "Meio-campo" },
  { value: "atacante", label: "Atacante" },
];

export default function SignupModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [document, setDocument] = useState("");
  const [birthDate, setBirthDate] = useState(""); // yyyy-mm-dd
  const [position, setPosition] = useState<string>("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passwordMismatch = confirm.length > 0 && confirm !== password;

  function validateNow(values?: {
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
    phone_number?: string;
    document?: string;
    birth_date?: string;
  }) {
    const v = {
      name,
      email,
      password,
      confirm,
      phone_number: phoneNumber,
      document,
      birth_date: birthDate,
      ...(values ?? {}),
    };
    const next: Errors = {};

    if (!v.name.trim()) next.name = "Nome é obrigatório.";
    if (!v.email.trim()) next.email = "Email é obrigatório.";
    if (!v.password?.trim()) next.password = "Senha é obrigatória.";
    if (!v.confirm?.trim())
      next.confirm = "Confirmação de senha é obrigatória.";
    if (v.password && v.confirm && v.password !== v.confirm)
      next.confirm = "As senhas não coincidem.";
    if (!v.phone_number?.trim()) next.phone_number = "Telefone é obrigatório.";
    if (!v.document?.trim()) next.document = "Documento é obrigatório.";
    if (!v.birth_date?.trim())
      next.birth_date = "Data de nascimento é obrigatória.";

    return next;
  }

  function validateAndSet() {
    const next = validateNow();

    setErrors((prev) => ({
      ...prev,
      name: next.name,
      email: next.email,
      password: next.password,
      confirm: next.confirm,
      phone_number: next.phone_number,
      document: next.document,
      birth_date: next.birth_date,
    }));

    return Object.keys(next).length === 0;
  }

  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    if (!acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        general: "Você deve aceitar os Termos e a Política de Privacidade.",
      }));

      return;
    }
    if (!validateAndSet()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));
    try {
      // Adjust the endpoint/body according to your backend
      await api.post("/auth/signup", {
        name,
        email,
        password, // backend should hash it
        phone_number: phoneNumber,
        document,
        birth_date: birthDate, // yyyy-mm-dd
        position: position || null, // optional
      });

      // Optionally notify parent
      onSuccess?.();

      // Reset and optionally switch to login
      closeAndReset();
      onSwitchToLogin?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível criar a conta. Tente novamente.";

      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setPhoneNumber("");
    setDocument("");
    setBirthDate("");
    setPosition("");
    setAcceptTerms(false);
    setErrors({});
    setAttemptedSubmit(false);
    setTouched({});
    onClose();
  };

  // Field-specific computed errors for UI feedback (required + touched/attempted)
  const nameError =
    !name.trim() && (attemptedSubmit || touched.name)
      ? "Nome é obrigatório."
      : errors.name;
  const emailError =
    !email.trim() && (attemptedSubmit || touched.email)
      ? "Email é obrigatório."
      : errors.email;
  const passwordError =
    !password.trim() && (attemptedSubmit || touched.password)
      ? "Senha é obrigatória."
      : errors.password;
  const confirmError =
    !confirm.trim() && (attemptedSubmit || touched.confirm)
      ? "Confirmação de senha é obrigatória."
      : passwordMismatch
        ? "As senhas não coincidem."
        : errors.confirm;
  const phoneError =
    !phoneNumber.trim() && (attemptedSubmit || touched.phone_number)
      ? "Telefone é obrigatório."
      : errors.phone_number;
  const documentError =
    !document.trim() && (attemptedSubmit || touched.document)
      ? "Documento é obrigatório."
      : errors.document;
  const birthDateError =
    !birthDate.trim() && (attemptedSubmit || touched.birth_date)
      ? "Data de nascimento é obrigatória."
      : errors.birth_date;

  return (
    <Modal
      hideCloseButton={loading}
      isOpen={isOpen}
      placement="center"
      size="md"
      onOpenChange={(open) => {
        if (!open) closeAndReset();
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Criar conta
            </ModalHeader>
            <ModalBody>
              {errors.general && (
                <div className="text-sm text-red-600" role="alert">
                  {errors.general}
                </div>
              )}
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  errorMessage={nameError}
                  isInvalid={!!nameError}
                  label="Nome"
                  placeholder="Seu nome"
                  type="text"
                  value={name}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, name: true }));
                    if (!name.trim())
                      setErrors((prev) => ({
                        ...prev,
                        name: "Nome é obrigatório.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setName(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                />
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
                    if (!email.trim())
                      setErrors((prev) => ({
                        ...prev,
                        email: "Email é obrigatório.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setEmail(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
                <Input
                  isRequired
                  errorMessage={phoneError}
                  isInvalid={!!phoneError}
                  label="Telefone"
                  placeholder="(11) 91234-5678"
                  type="tel"
                  value={phoneNumber}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, phone_number: true }));
                    if (!phoneNumber.trim())
                      setErrors((prev) => ({
                        ...prev,
                        phone_number: "Telefone é obrigatório.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setPhoneNumber(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({
                        ...prev,
                        phone_number: undefined,
                      }));
                  }}
                />
                <Input
                  isRequired
                  errorMessage={documentError}
                  isInvalid={!!documentError}
                  label="Documento"
                  placeholder="CPF ou RG"
                  type="text"
                  value={document}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, document: true }));
                    if (!document.trim())
                      setErrors((prev) => ({
                        ...prev,
                        document: "Documento é obrigatório.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setDocument(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, document: undefined }));
                  }}
                />
                <Input
                  isRequired
                  errorMessage={birthDateError}
                  isInvalid={!!birthDateError}
                  label="Data de nascimento"
                  placeholder="aaaa-mm-dd"
                  type="date"
                  value={birthDate}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, birth_date: true }));
                    if (!birthDate.trim())
                      setErrors((prev) => ({
                        ...prev,
                        birth_date: "Data de nascimento é obrigatória.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setBirthDate(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, birth_date: undefined }));
                  }}
                />
                <Select
                  label={"Posição (opcional)"}
                  placeholder={"Posição"}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  {POSITION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value || "none"}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.position && (
                  <span className="text-tiny text-danger">
                    {errors.position}
                  </span>
                )}
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
                    if (!password.trim())
                      setErrors((prev) => ({
                        ...prev,
                        password: "Senha é obrigatória.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setPassword(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    if (confirm && v === confirm)
                      setErrors((prev) => ({
                        ...prev,
                        confirm: undefined,
                      }));
                  }}
                />
                <Input
                  isRequired
                  errorMessage={confirmError}
                  isInvalid={!!confirmError}
                  label="Confirmar senha"
                  placeholder="••••••••"
                  type="password"
                  value={confirm}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, confirm: true }));
                    if (!confirm.trim())
                      setErrors((prev) => ({
                        ...prev,
                        confirm: "Confirmação de senha é obrigatória.",
                      }));
                    else if (password !== confirm)
                      setErrors((prev) => ({
                        ...prev,
                        confirm: "As senhas não coincidem.",
                      }));
                  }}
                  onChange={(e) => {
                    const v = e.target.value;

                    setConfirm(v);
                    if (errors.general)
                      setErrors((prev) => ({ ...prev, general: undefined }));
                    if (v.trim())
                      setErrors((prev) => ({ ...prev, confirm: undefined }));
                    if (password && v === password)
                      setErrors((prev) => ({
                        ...prev,
                        confirm: undefined,
                      }));
                  }}
                />
                <label className="flex items-start gap-2 text-sm">
                  <input
                    checked={acceptTerms}
                    className="mt-[3px]"
                    type="checkbox"
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.general)
                        setErrors((prev) => ({ ...prev, general: undefined }));
                    }}
                  />
                  <span className="text-default-500">
                    Eu concordo com os Termos e a Política de Privacidade
                  </span>
                </label>
              </div>
            </ModalBody>
            <ModalFooter className="flex flex-col sm:flex-row justify-between items-center">
              <div className="w-full text-center text-sm text-default-500 sm:w-auto sm:text-left">
                Já tem conta?{" "}
                <button
                  className="font-medium hover:underline"
                  type="button"
                  onClick={onSwitchToLogin}
                >
                  Entrar
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
                  Criar conta
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
