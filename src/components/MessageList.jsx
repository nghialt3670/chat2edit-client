import React, { useContext } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import MessagesContext from "../context/MessagesContext";

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function MessageList() {
  const { messages, setMessages } = useContext(MessagesContext);

  const renderRow = (props) => {
    const { index, style } = props;

    return <div>{messages[index]}</div>;
  };

  return (
    <FixedSizeList
      height={1000}
      width="60%"
      itemSize={46}
      itemCount={messages.length}
      overscanCount={5}
    >
      {renderRow}
    </FixedSizeList>
  );
}
