var ce = document.getElementById("rogrsCanvas");
var c = ce.getContext("2d");
var f = document.getElementById("rogrsForm");
var rogrsLogo = new Image();
rogrsLogo.src = ".//graphics/x2/logo_black.png";

var ratingImg = {
    "E": new Image(),
    "P": new Image(),
    "T": new Image(),
    "A": new Image()
}
ratingImg.E.src = "./graphics/x2/rating_icon_e.png";
ratingImg.P.src = "./graphics/x2/rating_icon_p.png";
ratingImg.T.src = "./graphics/x2/rating_icon_t.png";
ratingImg.A.src = "./graphics/x2/rating_icon_a.png";

var ratingBannerImg = {
    "E": new Image(),
    "P": new Image(),
    "T": new Image(),
    "A": new Image()
}
ratingBannerImg.E.src = "./graphics/x2/rating_banner_e.png";
ratingBannerImg.P.src = "./graphics/x2/rating_banner_p.png";
ratingBannerImg.T.src = "./graphics/x2/rating_banner_t.png";
ratingBannerImg.A.src = "./graphics/x2/rating_banner_a.png";

function generate() {
    ce.height = 0;
    reasons = [];
    var names = [];
    var options = f.getElementsByTagName("input");
    for (i = 0; i < options.length; i++) {
        var o = options[i];
        if (o.type != "button" && o.value != "None" && o.value == f[o.name].value) {
            if (o.type == "radio") {
                reasons.push(o.value);
            }
            if (o.type == "checkbox" && o.checked) {
                reasons.push(o.value);
            }
        }
    }
    reasons.sort();

    ce.height = Math.max(96, (0.25 + reasons.length) * 16);

    if (rogrsImgSettings.size.value == "Large") {
        ce.width = 320;
    } else {
        ce.width = 68;
    }

    c.fillStyle = "white";
    c.fillRect(0, 0, 512, 512);
    c.fillStyle = "black";
    c.font = "Bold 11pt Arial";
    for (r = 0; r < reasons.length; r++) {
        var y = ((r + 1) * 16);
        var x = 72;
        var t = reasons[r];
        c.fillText(t, x, y);
        console.log(":", t, x, y);
    }
    c.fillStyle = "black";
    c.fillRect(0, 0, 68, 512);              // Fill sidebar

    c.fillRect(0, 0, 512, 2);               // Top border
    c.fillRect(0, ce.height - 2, 512, 512); // Bottom border
    c.fillRect(ce.width - 2, 0, 512, 512);  // Right border

    c.drawImage(rogrsLogo, 2, 0);            // Draw logo

    c.drawImage(ratingImg[rogrsImgSettings.rating.value], 2, 16);
    c.drawImage(ratingBannerImg[rogrsImgSettings.rating.value], 2, 80);
}

function autoCalculateRating() {
    var pbase = 0; // Score base, 0=Everyone
    
    // Violencia
    var violence = f.violence.value;
    if (violence.includes("Mild Cartoon")) pbase = Math.max(pbase, 0); // E
    else if (violence.includes("Cartoon Violence")) pbase = Math.max(pbase, 1); // P
    else if (violence.includes("Intense Cartoon")) pbase = Math.max(pbase, 1); // P
    else if (violence.includes("Mild Fantasy")) pbase = Math.max(pbase, 1); // P
    else if (violence.includes("Fantasy Violence") && !violence.includes("Mild")) pbase = Math.max(pbase, 1); // P
    else if (violence.includes("Intense Fantasy")) pbase = Math.max(pbase, 2); // T
    else if (violence.includes("Mild Realistic")) pbase = Math.max(pbase, 1); // P
    else if (violence.includes("Realistic Violence") && !violence.includes("Mild")) pbase = Math.max(pbase, 2); // T
    else if (violence.includes("Intense Realistic")) pbase = Math.max(pbase, 3); // A
    
    // Violencia sexual - automáticamente A
    if (f.sexual_violence.checked) pbase = 3;
    
    // Sangre
    var blood = f.blood.value;
    if (blood === "Animated Blood") pbase = Math.max(pbase, 1); // P
    else if (blood === "Realistic Blood") pbase = Math.max(pbase, 2); // T
    else if (blood === "Blood and Gore") pbase = Math.max(pbase, 3); // A
    
    // Alcohol
    if (f.alcohol.value === "Alcohol Reference") pbase = Math.max(pbase, 1); // P
    else if (f.alcohol.value === "Alcohol Use") pbase = Math.max(pbase, 2); // T
    
    // Drogas
    if (f.drugs.value === "Drug Reference") pbase = Math.max(pbase, 2); // T
    else if (f.drugs.value === "Drug Use") pbase = Math.max(pbase, 3); // A
    
    // Tabaco
    if (f.tobacco.value === "Tobacco Reference") pbase = Math.max(pbase, 1); // P
    else if (f.tobacco.value === "Tobacco Use") pbase = Math.max(pbase, 2); // T
    
    // Desnudez
    if (f.nudity.value === "Brief Nudity") pbase = Math.max(pbase, 2); // T
    else if (f.nudity.value === "Nudity") pbase = Math.max(pbase, 3); // A
    
    // Temas sexuales
    if (f.sexual_themes.value === "Suggesstive Themes") pbase = Math.max(pbase, 1); // P
    else if (f.sexual_themes.value === "Sexual Themes") pbase = Math.max(pbase, 2); // T
    else if (f.sexual_themes.value === "Strong Sexual Content") pbase = Math.max(pbase, 3); // A
    
    // Apuestas reales
    if (f.gambling.value === "Real Gambling") pbase = Math.max(pbase, 3); // A
    else if (f.gambling.value === "Simulated Gambling") pbase = Math.max(pbase, 1); // P
    
    if (f.humor.value === "Crude Humor") pbase = Math.max(pbase, 1); // P
    else if (f.humor.value === "Mature Humor") pbase = Math.max(pbase, 2); // T
    
    if (f.language.value === "Mild Language") pbase = Math.max(pbase, 1); // P
    else if (f.language.value === "Moderate Language") pbase = Math.max(pbase, 2); // T
    else if (f.language.value === "Strong Language") pbase = Math.max(pbase, 3); // A
    
    if (f.disturbingcontent.checked) pbase = Math.max(pbase, 2); // T
    
    var ratings = ["E", "P", "T", "A"];
    var ratingSelect = document.getElementById("ratingSelect");
    ratingSelect.value = ratings[pbase];
    
    generate();
}