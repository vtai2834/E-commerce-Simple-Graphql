import Cookies from "js-cookie";
import { IParseDataGetMeInfo } from "@services/queries/get-me-info/getMeInfo.type";
import { IParseDataRefreshToken, IRefreshTokenInput } from "@services/mutations/refreshToken/refreshToken.type";
import { RESPONSE_CODE } from '@constants/index'

/**
 * Hàm xử lý khi accessToken hết hạn (code === 1006)
 * @param data Kết quả trả về từ getMeInfo
 * @param onHandleGetMeInfo Hàm gọi lại getMeInfo
 * @param onHandleRefreshToken Hàm gọi mutation refreshToken
 * @returns Kết quả mới từ getMeInfo hoặc null nếu refreshToken fail
 */
export async function handleExpiredAccessToken(
  data: IParseDataGetMeInfo | undefined,
  onHandleGetMeInfo: () => Promise<IParseDataGetMeInfo>,
  onHandleRefreshToken: (input: IRefreshTokenInput) => Promise<IParseDataRefreshToken> // Cập nhật kiểu tham số
): Promise<IParseDataGetMeInfo | null> {
  if (!data || data.code !== RESPONSE_CODE.TOKEN_EXPIRED) return data || null;

  console.log("data truyền vào: ", data);

  // Lấy refreshToken từ cookie hoặc từ data
  const refreshToken = Cookies.get("refreshToken") || data.refreshToken;
  console.log("refreshToken: ", refreshToken);
  if (!refreshToken) return null;

  try {
    // Gọi mutation refreshToken
    const refreshRes = await onHandleRefreshToken({ refreshToken }); // Truyền trực tiếp refreshToken vào input

    console.log("refreshRes: ", refreshRes);
    if (refreshRes && refreshRes.code === RESPONSE_CODE.SUCCESS_MUTATION && refreshRes.accessToken) {
      // Set lại accessToken vào cookie
      console.log("set acess");
      Cookies.set("accessToken", refreshRes.accessToken, {
        expires: 1,   // sống 1h
        sameSite: "strict"
    });
      // Gọi lại getMeInfo (token mới đã được set vào cookie)
      const meInfo = await onHandleGetMeInfo();
      return meInfo;
    }
    return null;
  } catch (err) {
    return null;
  }
}
