import Http from "@/Http";

const BaseURL = import.meta.env.VITE_API_HOST;

export const getUnreadCount = async (): Promise<number> => {
  try {
    const token = localStorage.getItem("token");
    Http.setBearerToken(token);
    const response = await Http.callApi("get", `${BaseURL}/summaries/unread-count`);
    return response?.data?.count || null;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return null;
  }
};
