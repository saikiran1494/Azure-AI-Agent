export function callAgentAPI(input: string): Promise<any> {
  return fetch("https://localhost:7131/api/Agent/AIAgent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Prompt: input }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("API response:", data);
      return data;
    })
    .catch((error) => {
      console.error("API call failed:", error);
      throw error;
    });
}
