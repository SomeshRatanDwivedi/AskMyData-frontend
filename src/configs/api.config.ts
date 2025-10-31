/**
 * @fileoverview This file contains api handler configs.
 * @date 30/09/2024
 * @author Copyright © 2022, Cheers Interactive Pvt Ltd.  All rights reserved.
 */

import useUserStore from "@/stores/user.store";
import type { AxiosError } from "axios";



export function requestHandler(err: AxiosError) {
  return Promise.reject(err as Error);
}


export async function responseHandler(err: AxiosError) {
  if (err?.response?.status === 403) {
    useUserStore.getState().stFnResetUserStore();
    localStorage.clear();
    window.location.href = "/auth/login";
    return Promise.reject(err as Error);
  }
  return Promise.reject(err as Error);
}

//if (err?.request?.)
