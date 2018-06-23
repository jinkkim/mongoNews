$(document).ready(function(){

    //event listner for delete button
    $('.deleteArticle').on("click", function(){
        var url = "/deleteArticle/" + this.id;
        fetch(url, {
            method: 'POST'
        });
    });
    
    //event listener for saved article
    $('.saveArticle').on("click", function(){
        var title = $(this).parent().find("p.article_title").text();
        var brief = $(this).parent().find("p.article_brief").text();
        var date =  $(this).parent().find("p.article_date").text();
        var link =  $(this).parent().find("a").attr("href");
        var imgLink = $(this).parent().find("img").attr("src");
        var savedAt = Date.now();

        var Article2save = {
            title,
            brief,
            date,
            link,
            imgLink,
            savedAt,
            note: null
        };

        fetch("/saveArticle", {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(Article2save)
        })
    });


})