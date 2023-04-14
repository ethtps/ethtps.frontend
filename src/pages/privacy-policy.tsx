import { Container } from "@mantine/core";
import ReactFileMarkdown from "./components/Markdown/ReactFileMarkdown";

export default function PrivacyPolicy() {
    return (
        <>
            <Container>
                <ReactFileMarkdown fileName="PrivacyPolicy.md" />
            </Container>
        </>
    );
}