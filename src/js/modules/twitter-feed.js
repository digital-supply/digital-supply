import $ from "jquery";

(function() {
  /**
   * Remove all of the 'Twitter' things like @'s, #'s, and links.
   * @param str tweet - the original tweet
   * @returns str
   */
  const parseTweetText = function(tweetText) {
    const noUrls = tweetText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    const noMentionsOrHashs = noUrls.replace(/(?:@|#)[\n\S]+/g, '');
    const noThreads = noMentionsOrHashs.replace(/🧵/g, '');

    const trimmed = $.trim(noThreads).substring(0, 75)
    .split(' ').slice(0, -1).join(' ') + '...';

    return trimmed;
  };

  /**
   * Return Tweet components consistently - whether it's from a retweet or not.
   * @param obj tweet - the full tweet object
   * @returns obj
   */
  const getTweetComponents = function(tweet) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    if (tweet.retweeted_status) {
      return {
        link: `https://twitter.com/${tweet.retweeted_status.user.screen_name}/status/${tweet.retweeted_status.id_str}`,
        text: parseTweetText(tweet.retweeted_status.full_text),
        date: new Date(tweet.created_at).toLocaleDateString('en-US', options),
      };
    } else {
      return {
        link: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
        text: parseTweetText(tweet.full_text),
        date: new Date(tweet.created_at).toLocaleDateString('en-US', options),
      };
    }
  }

  $.getJSON('https://gist.githubusercontent.com/mcnamee/5b117b94879833aadeaee0c3ebca8858/raw/recent-tweets.json')
    .done(function(data) {
      $.each(data, function(i, item) {
        const tweet = getTweetComponents(item);

        // First card.
        if (i === 0) {
          return $('[data-twitter-feed-1]').append(`<a target="_blank" href="${tweet.link}" class="card-title"><h3 class="fs-3">${tweet.text}</h3></a><time datetime="${tweet.date}" class="eyebrow text-muted">${tweet.date}</time>`);
        }

        // Only output 5 records
        if ( i === 5 ) {
          return false;
        }

        // Standard cards.
        return $('[data-twitter-feed]').append(`<div class="col-md-6"><article class="card"><a target="_blank" href="${tweet.link}" class="card-title">${tweet.text}</h6></a><time datetime="${tweet.date}" class="eyebrow text-muted">${tweet.date}</time></article></div>`);
      });
    });
})();
