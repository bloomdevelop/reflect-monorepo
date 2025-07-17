import { createForm, FormError, SubmitHandler } from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import Button from "~/components/ui/Button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { TextInput } from "~/components/ui/ModularFormsInput";
import { client } from "~/lib/revolt";

type LoginForm = {
    email: string,
    password: string
}

export default function LoginPage() {
    const [loginForm, {Form, Field}] = createForm<LoginForm>();
    const navigate = useNavigate();

    const handleSubmit: SubmitHandler<LoginForm> = async (values, _) => {
        try {
            await client.login({
                email: values.email,
                password: values.password
            }).catch((err) => {
                throw new FormError<LoginForm>("Something went wrong.", err)
            })

            navigate("/app/home");
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div class="flex flex-col justify-center items-center h-screen">
            <Card>
                <CardHeader>
                    Let's get you logged in
                </CardHeader>
                <CardContent>
                    <Form onSubmit={handleSubmit} class="flex flex-col gap-4">
                        <Field name="email">
                            {(field, props) => (
                                <TextInput
                                    {...props}
                                    {...field}
                                    type="email"
                                    placeholder="Email"
                                />
                            )}
                        </Field>
                        <Field name="password">
                            {(field, props) => (
                                <TextInput
                                    {...props}
                                    {...field}
                                    type="password"
                                    placeholder="Password"
                                />
                            )}
                        </Field>
                        <Button loading={loginForm.submitting} disabled={loginForm.submitting} type="submit" variant="primary">
                            Login
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}