import React from 'react';
//Teste
import { render } from "@testing-library/react";
import App from '../../App';


describe("Sidebar", () => {
    it("should toggle sidebar when button is clicked", () => {
        const sideBarRef = React.createRef<HTMLDivElement>();

        render(<App/> as React.ComponentType);

    });

});