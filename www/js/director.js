function initDirSettingsPage() {
    var el = document.getElementById("dir-this-tablet-name");
    el.innerHTML = tablet[thisTabletIx].name;
    el = document.getElementById("dir-this-tablet-rank");
    el.innerHTML = tablet[thisTabletIx].type;
}