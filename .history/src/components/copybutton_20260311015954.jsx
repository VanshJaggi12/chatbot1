import React, { useState } from "react";

function CopyButton({ text }) {

  const [copied,setCopied] = useState(false);

  const handleCopy = () => {

    navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(()=>{
      setCopied(false);
    },2000);

  };

  return(

    <button
      className="copy-btn"
      onClick={handleCopy}
    >

      {copied ? "Copied!" : "Copy"}

    </button>

  );

}

export default CopyButton;