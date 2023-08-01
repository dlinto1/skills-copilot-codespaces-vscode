function skillsMember() {
    var member = document.getElementById("member");
    var memberButton = document.getElementById("memberButton");
    var memberDropdown = document.getElementById("memberDropdown");

    if (memberButton.innerHTML == "▼") {
        memberButton.innerHTML = "▲";
        memberDropdown.style.display = "block";
        member.style.height = "auto";
    } else {
        memberButton.innerHTML = "▼";
        memberDropdown.style.display = "none";
        member.style.height = "0";
    }
}