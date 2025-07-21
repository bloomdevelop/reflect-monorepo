import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  TextField,
} from "@suid/material";
import { createSignal } from "solid-js";
import { client } from "~/lib/revolt";
import { useNavigate } from "@solidjs/router";
import { sessionStorage } from "~/lib/storage";
import { detectBrowser } from "~/lib/detect";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [loading, setLoading] = createSignal<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.login({
        email: email(),
        password: password(),
        friendly_name: detectBrowser(),
      }).then(() => {
        if (client.session) {
          sessionStorage.setItem("session", JSON.stringify(client.session));
          navigate("/app/home");
        }
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <Card>
        <CardHeader title="Login" />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Stack gap={2}>
              <TextField
                label="Email"
                type="email"
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <TextField
                label="Password"
                type="password"
                value={password()}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Box
              sx={{
                m: 1,
                position: "relative",
              }}
            >
              <Button disabled={loading()} variant="contained" type="submit">
                Login
              </Button>
              {loading() && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}
