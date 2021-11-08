import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const [text, setText ] = useState("");
    const [ editActive, setEditActive ] = useState(false);

    function handleDragStart(event) {
        if(!store.isItemEditActive){
            event.dataTransfer.setData("item", event.target.id);
        }
    }

    function handleDragOver(event) {
        if(!store.isItemEditActive){
            event.preventDefault();
        }
    }

    function handleDragEnter(event) {
        if(!store.isItemEditActive){
            event.preventDefault();
            setDraggedTo(true);
        }
    }

    function handleDragLeave(event) {
        if(!store.isItemEditActive){
            event.preventDefault();
            setDraggedTo(false);
        }
    }

    function handleDrop(event) {
        if(!store.isItemEditActive){
            event.preventDefault();
            let target = event.target;
            let targetId = target.id;
            targetId = targetId.substring(target.id.indexOf("-") + 1);
            let sourceId = event.dataTransfer.getData("item");
            sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
            setDraggedTo(false);

            // UPDATE THE LIST
            store.addMoveItemTransaction(sourceId, targetId);
        }
    }

    function handleEditItem(event){
        if(!store.isItemEditActive){
            document.getElementById("undo-button").style.opacity = 0.2;
            document.getElementById("close-button").style.opacity = 0.2;
            document.getElementById("redo-button").style.opacity = 0.2;
            //event.preventDefault();
            //event.stopPropagation();
            let idd = event.target.id.charAt(10);
            setText(store.currentList.items[idd]);
            store.setIsItemEditActive();
            toggleItemEdit();
            let id = event.target.id;
            //console.log(event.target.id); this gives you "edit-item-01, 11, 21, 32, 41"
        }
    }

    function toggleItemEdit() {
        let newActive = !editActive;
        setEditActive(newActive);
    }

    function handleKeyPress(event){
        if(event.code === "Enter"){
            let index = event.target.id.charAt(10); //gives you the item number we are working on 
            //store.changeItemName(index, text);
            store.addChangeItemTransaction(index, text);
            toggleItemEdit();
        }
    }

    function handleUpdateText(event){
        setText(event.target.value);
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    let itemElement = 
        <div
            id={'item-' + (index + 1)}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
           <IconButton aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}} onClick={handleEditItem}/>
            </IconButton>
            {props.text}
        </div> 

    if(editActive){
        itemElement = 
            <TextField
                margin="normal"
                required
                fullWidth
                id={"edit-item-" + index + 1}
                label="Top 5 Item Name"
                name="name"
                autoComplete="Top 5 List Name"
                className={itemClass}
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={text}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }


    return (
        itemElement
        );
}

export default Top5Item;