/**
 *  SmartThings-Car
 *  SmartThings device to power on your car
 * 
 *
 */

preferences {
    input("serverIp", "text", title: "Bridge IP", description: "The IP of the bridge (server) running the node module")
    input("serverPort", "number", title: "Bridge Port", description: "The port of the smartthings-car bridge (default: 80)")    
    input("token", "text", title: "Authentication token", description: "Can be found in the bridge console")
}

metadata {
    definition (name: "Car Controller", namespace: "regg00", author: "regg00@gmail.com") {
        capability "Actuator"
        capability "Switch" 
        capability "Configuration"
    }

    tiles (scale: 2) {
        multiAttributeTile(name:"switch", type: "lighting", width: 6, height: 4, canChangeIcon: true) {
            tileAttribute ("device.switch", key: "PRIMARY_CONTROL") {
                attributeState "on", label:'${name}', action:"switch.off", icon:"st.Transportation.transportation8", backgroundColor:"#79b821"
                attributeState "off", label:'${name}', action:"switch.on", icon:"st.Transportation.transportation8", backgroundColor:"#ffffff"
            }
        }

        main(["switch"])
        details(["switch"])
    }
}

def parse(String description) {
    log.debug "Parsing '${description}'"
}

def off() { 
    sendEvent(name: "switch", value: "off")
    log.debug "off"
}

def on() {
    sendEvent(name: "switch", value: "on")
    log.debug "on"
    def result = new physicalgraph.device.HubAction(
        method: "GET",
        path: "/start?token=" + token,
        headers: [
            HOST: serverIp + ":" + serverPort
        ]
    )
    sendEvent(name: "switch", value: "off")
    return result
}

