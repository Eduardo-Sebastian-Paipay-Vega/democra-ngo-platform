import { useEffect } from "react";
import "../landing/landing.css";
import "./login.css";
import { LoginGateway } from "../../app/LoginGateway";

export function LoginPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Iniciar sesión · democra.pro";
    return () => {
      document.title = previous;
    };
  }, []);

  return <LoginGateway />;
}
