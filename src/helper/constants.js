import { ReactComponent as  LinkIcon } from "../asset/icon/link-solid.svg"
import { ReactComponent as  FaceIcon } from "../asset/icon/face-smile-solid.svg"
import { ReactComponent as  VoiceIcon } from "../asset/icon/microphone-lines-solid.svg"
import { ReactComponent as  SearchIcon } from "../asset/icon/magnifying-glass-solid.svg"
import { ReactComponent as  SendIcon } from "../asset/icon/send-icon.svg"
import { ReactComponent as  XIcon } from "../asset/icon/xmark-solid.svg"
import { ReactComponent as  OIcon } from "../asset/icon/o-solid.svg"

export const LOCAL_STORAGE_KEY = process.env.REACT_APP_LOCALSTORAGE_TOKEN_NAME
export const API_BASE_URL = process.env.REACT_APP_SOCKET_IO_URL
export const API_URL = process.env.REACT_APP_SOCKET_IO_URL + "/api"

export {
    LinkIcon, FaceIcon, VoiceIcon, SearchIcon, SendIcon, XIcon, OIcon
}