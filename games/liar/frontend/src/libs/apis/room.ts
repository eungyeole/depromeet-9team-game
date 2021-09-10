import { RoomCreateData } from "../../pages/MainPage"
import request from "../axios"
export default {
    createRoom(data: RoomCreateData){
        return request({
            url: "/room",
            method: "POST",
            data
        })
    },
    getTopics(){
        return request({
            url: "/topic",
            method: "GET",
        })
    },
    getUsers(roomId: string){
        return request({
            url: `/chatroom/${roomId}`,
            method: "GET"
        })
    }
}