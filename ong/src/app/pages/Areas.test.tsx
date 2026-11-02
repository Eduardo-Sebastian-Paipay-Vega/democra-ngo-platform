import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Areas } from "./Areas";
import * as areasService from "../services/gobernanza/areas.service";
import { toast } from "sonner";

vi.mock("../services/gobernanza/areas.service", () => ({
  listAreas: vi.fn(),
  createArea: vi.fn(),
  updateArea: vi.fn(),
  toggleAreaActive: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Provide a mock ErrorBoundary to test boundaries
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary-fallback">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

describe("Areas Page - Zero-Fail Tolerance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle infinite loading gracefully", async () => {
    // Simulate an infinite promise that never resolves
    vi.mocked(areasService.listAreas).mockImplementation(
      () => new Promise(() => {}) // pending forever
    );

    render(
      <ErrorBoundary>
        <Areas />
      </ErrorBoundary>
    );

    // Initial state is loading (since we never resolve)
    // The loading state inside DataTable should be shown (e.g. skeleton or empty loading message)
    // Wait for the component to be rendered
    await waitFor(() => {
      // It shouldn't crash
      expect(screen.getByText("Áreas Organizacionales")).toBeInTheDocument();
    });
  });

  it("should handle network failure on initial load without crashing", async () => {
    vi.mocked(areasService.listAreas).mockRejectedValue(new Error("503 Timeout"));

    render(
      <ErrorBoundary>
        <Areas />
      </ErrorBoundary>
    );

    // useAreas captura el fallo de listAreas y lo expone como estado `error`
    // (no vía toast); Areas.tsx renderiza el panel de error con el mensaje.
    // La página no se rompe: la cabecera sigue presente.
    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar las áreas")).toBeInTheDocument();
    });
    expect(screen.getByText("503 Timeout")).toBeInTheDocument();
    expect(screen.getByText("Áreas Organizacionales")).toBeInTheDocument();
  });

  it("should not break when creating an area fails", async () => {
    vi.mocked(areasService.listAreas).mockResolvedValue([]);
    vi.mocked(areasService.createArea).mockRejectedValue(new Error("Save failed"));

    render(<Areas />);

    // Con 0 áreas, Areas.tsx muestra el estado vacío del rediseño.
    await waitFor(() => {
      expect(screen.getByText("No hay áreas registradas")).toBeInTheDocument();
    });

    // Abrir el modal de creación (hay varios botones "Nueva área": cabecera +
    // estado vacío; cualquiera abre el modal).
    const createButton = screen.getAllByRole("button", { name: /Nueva área/i })[0];
    fireEvent.click(createButton);

    // Placeholders reales del formulario rediseñado.
    const inputCode = screen.getByPlaceholderText("Ej: FIN-01");
    const inputName = screen.getByPlaceholderText("Ej: Finanzas");

    fireEvent.change(inputCode, { target: { value: "TEST" } });
    fireEvent.change(inputName, { target: { value: "Test Area" } });

    const submitButton = screen.getByRole("button", { name: "Guardar" });
    fireEvent.click(submitButton);

    // El hook useAreas atrapa el error de createArea y lo notifica por toast,
    // sin tumbar la página.
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Save failed");
    });
    expect(screen.getByText("Áreas Organizacionales")).toBeInTheDocument();
  });
});
