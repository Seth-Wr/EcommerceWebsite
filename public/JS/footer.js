const createFooter = () => {
    let footer = document.querySelector('footer');

    footer.innerHTML = `
    <div class="footer-content">
    <div class="footer-ul-container">
        <ul class="category">
            <li class="category-title">women</li>
            <li><a href="#" class="footer-link">Swim suits</a></li>
            <li><a href="#" class="footer-link">Sets</a></li>
            <li><a href="#" class="footer-link">Tops</a></li>
            <li><a href="#" class="footer-link">Bottoms</a></li>
        </ul>
</div>
<p class="footer-title">about company</p>
<p class="info">We are a small family operated e-commerce company. Bringing cool styles for you to show off is why we do what we do. We are always looking for solid staples and new trends in fashion to fuffill all of our fellow Kings and Queens to look there best!</p>
<p class="info">support email - help@glamgirls.com, customersupport@glamgirls.com </p>
<p class="info">telephone - 6263405966</p>
<div class="footer-social-container">
    <div>
        <a href="#" class="social-link">terms & service</a>
        <a href="#" class="social-link">privacy</a>
    </div>
    <div>
        <a href="#" class="social-link">instagram</a>
        <a href="#" class="social-link">facebook</a>
        <a href="#" class="social-link">twitter</a>
    </div>
</div>
<p class="footer-credit">Brookes, Glams girls</p>
    `;
}
createFooter();