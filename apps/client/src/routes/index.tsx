import { createSignal } from "solid-js";
import IconButton from "~/components/ui/IconButton";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Link from "~/components/ui/Link";
import { Icon } from "@iconify-icon/solid";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { A } from "@solidjs/router";

export default function Home() {
  const [text, setText] = createSignal<string>("");
  return (
    <main>
      <Button variant="primary">Hello!</Button>
      <Button variant="secondary">Hello!</Button>
      <Button variant="danger">Hello!</Button>
      <IconButton size="md" variant="primary">
        <Icon icon="mdi:home" />
      </IconButton>
      <Link href="/about">About</Link>
      <Input
        placeholder="Meow"
        value={text()}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <A href="/login">
        <Button variant="primary" icon={<Icon icon="material-symbols:login-rounded"/>}>
          Login
        </Button>
      </A>
      <Card>
        <CardHeader>This is a card!</CardHeader>
        <CardContent>
          Card Content
        </CardContent>
      </Card>
    </main>
  );
}
