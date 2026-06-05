const replace = () => {
    const url = 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbo3kWQKnq3FzliOp0bmKxCDBF8wlIGkeXF2DDA-tkSUoYWeEWXWI50L-KYg_-CYCj7CumrrPPd8nGEnwC8jH1ADaojSY2Gdhk-8wbLV81zqVjBU.jpg?r=db3';
    const imgs = document.getElementsByTagName('img');
    
    for (const img of imgs) {
        img.src = url;
    }
};

window.setInterval(() => {
    replace();
}, 500);

replace();