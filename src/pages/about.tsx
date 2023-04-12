import React, { useState } from "react";
import ReactFileMarkdown from "./components/Markdown/ReactFileMarkdown";
import { Container } from "@mantine/core";

export default function About() {
    return (
        <>
            <Container>
                <ReactFileMarkdown fileName="About.md" />
            </Container>
        </>
    );
}