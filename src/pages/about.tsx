import React, { useState } from "react";
import { Container } from "@mantine/core";
import { ReactFileMarkdown } from "./components";

export default function About() {
    return (
        <>
            <Container>
                <ReactFileMarkdown fileName="About.md" />
            </Container>
        </>
    );
}