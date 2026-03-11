export function formatMarkdown(text){

  if(!text) return "";

  let formatted = text;

  formatted = formatted.replace(/```/g,"\n```");

  formatted = formatted.replace(/\n{3,}/g,"\n\n");

  return formatted;

}