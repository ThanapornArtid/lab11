export async function login(email: string, password: string): Promise<string> {
    const response = await fetch("http://203.159.93.114:3100/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
});

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    return data.access_token;
}