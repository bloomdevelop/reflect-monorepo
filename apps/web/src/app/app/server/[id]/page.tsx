

export default async function ServerPage({
    params
}: {
    params: Promise<{id: string}>
}) {
    const { id } = await params;
    return <p>Hello from Server {id}</p>
}