/**
 *
 * @param {Object} messages Discord message object
 * @param {Number} maxAge Time in milliseconds
 * @returns Array of discord message objects that are younger than the max age.
 */
const removeOldMessages = (messages, maxAge) => {
  return messages.filter((message) => getMessageAge(message) <= maxAge);
};

/**
 *
 * @param {Object} message Discord message object
 * @param {Array} messages Array of discord message objects
 * @returns Array of messages that have the same content
 */
const getMessageDuplicates = (message, messages) => {
  return messages
    .filter(
      (similarMessage) =>
        similarMessage.content.toLowerCase() === message.content.toLowerCase()
    )
    .map((message) => message.id);
};

/**
 *
 * @param {Object} message Discord message object
 * @param {Array} messages Array of discord message objects
 * @returns Array of discord message object that are duplicates, that are also sent from the message author
 */
const getMessageDuplicatesByAuthor = (message, messages) => {
  return getMessageDuplicates(
    message,
    messages.filter((m) => m.author.id === message.author.id)
  );
};

/**
 *
 * @param {Array} messages Array of discord message objects (modified with a .tags[] property)
 */
const messagesToTable = (messages) => {
  /**
   * Logs out an array of processed
   * messages as an array to the console
   */

  const msToSeconds = (ms) => Math.floor(ms / 1000);

  console.log("");
  console.table(
    messages.map((message) => {
      return {
        TAGS: message.tags.join(","),
        CONTENT: message.content.substr(0, 15) + "...",
        ID: message.id,
        AGE: msToSeconds(getMessageAge(message)) + "s",
      };
    })
  );
  console.log("");
};

/**
 * 
 * @param {Object} message Discord message object 
 * @returns Array of links found the in message content
 */
const getMessageLinks = (message) => {
  return message.content.match(/((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/g) || [];
};

/**
 * 
 * @param {Object} message Discord message object
 * @returns Message content with censored links.
 */
const defangMessageLinks = (message) => {
  const messageLinks = getMessageLinks(message);

  var defangedText = message.content;

  for (link of messageLinks) {
    var thirdLinkLength = Math.floor(link.length / 3);
    var thirdOfLink = link.substr(thirdLinkLength, thirdLinkLength);
    var newLink = link.split(thirdOfLink).join(".".repeat(thirdLinkLength))

    defangedText = defangedText.split(link).join(newLink)
  }

  return defangedText;
};

/**
 * 
 * @param {Object} message Discord message object
 * @param {String} tag The tag describing the message content
 */
const tagMessage = (message, tag) => {
  if (!message.tags.includes(tag)) {
    message.tags.push(tag);
  }
};

/**
 * 
 * @param {Array} messages Discord message objects 
 * @param {String} tag The tag describing the message content
 */
const tagMessages = (messages, tag) => {
  messages.map((message) => {
    tagMessage(message, tag);
  });
};

/**
 * 
 * @param {Object} message Discord message object
 * @returns Boolean If the message has an embed
 */
const messageHasEmbeds = (message) => {
  return message.embeds.length > 0;
};

/**
 * 
 * @param {Object} message Discord message object
 * @returns Number Time in milliseconds that the message has existed
 */
const getMessageAge = (message) => {
  return Date.now() - message.createdTimestamp;
};

module.exports = {
  removeOldMessages,
  getMessageDuplicates,
  getMessageAge,
  messageHasEmbeds,
  getMessageDuplicatesByAuthor,
  tagMessages,
  tagMessage,
  getMessageLinks,
  defangMessageLinks,
  messagesToTable
};
