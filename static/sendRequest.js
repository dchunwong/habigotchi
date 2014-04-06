function sendRequest(type, url, data){
    xmlhttp = newHttpRequest();
    xmlhttp.open(type, url);
    if (type == "GET")
        xmlhttp.send();
    else
        xmlhttp.send(data);
    if (xmlhttp.status == 200)
        return JSON.parse(xmlhttp.response);
    else
        return {"success": false, "message": "Something Happened?"};
}