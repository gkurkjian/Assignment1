const { response } = require("express");
let movieData = [];

let title = '';

let page = 1;

let perPage = 10;

const movieTableTemplate = _.template(
    `<% _.forEach(movieData, function(movies) { %>
        <tr data-id=<%- _id %>>
            <td><%- year %></td>
            <td><%- title %></td>
            <td><%- plot %></t  d>
            <td><%- rated %></td>
            <td><%- runtime %></td>            
        </tr>
    <% }); %>`
);

function loadMovieData() {
    fetch(`https://good-teal-millipede-tutu.cyclic.app/api/movies?page=${page}&perPage=${perPage}`)
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        movieData = myJson;
        let rows = movieTableTemplate(movieData);
        $("#moviesTable tbody").html(rows);
        $("#current-page").html(page);
    })
}

function testingCall(){
    console.log('Hello from main.js');
}