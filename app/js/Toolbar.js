export default class Toolbar {
    constructor(routes) {
        this.$container = document.querySelector('.checkbox-container');
        this._routes = routes;
        this._renderRoutesList(routes);
    }

    _renderRoutesList(routes) {
        const listHtml = [];
        routes.forEach((r) => {
            listHtml.push(
                `<label class="route-item">
                    <input type="checkbox" value="${r.tag}" class="js-route-checkbox"
                        onclick="onRouteSelectionChange(this)">
                    ${r.title}
                </label><br>`);
        });
        this.$container.innerHTML = listHtml.join('\n');
    }
}
