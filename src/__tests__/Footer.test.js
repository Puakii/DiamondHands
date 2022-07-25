import * as React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../components/EntireWebsite/Footer";

it("renders correct content", () => {
    render(<Footer />);

    expect(screen.getByTestId("testing")).toBeTruthy();
});
