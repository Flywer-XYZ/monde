function httpGet(theUrl)
{
    //
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    document.getElementById('title').textContent = "Conseil"
    return xmlHttp.responseText;
}
function load() {
    document.getElementById('title').textContent = "loading..."
    document.getElementById('tip').textContent = httpGet('/tip')
}
window.onload = load