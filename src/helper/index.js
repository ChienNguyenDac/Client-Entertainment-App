import Avatar from "../asset/img/avatar.jpg"

export function convertUserData(user) {
    return {
        ...user,
        avatar: Avatar,
        messages: [],
        lastOnline: 'online'
    }
}

export function onChangeInputText(event, callback) {
    const { value } = event.target
    callback(value)
}