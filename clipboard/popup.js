// ----------  variables  -----------
var text_arr, drag_index, drop_index

dummy_li = document.getElementsByTagName("li")[0]
add_btn = document.getElementById("add_btn")
text_input = document.getElementById("text_input")
list = document.getElementById("text_list")
reset_undo_btn = document.getElementById("reset_undo_btn")
reset_btn = document.getElementById("reset_btn")


// ----- get index ----------
getIndex = (curr_item) => {
    index = 0;
    while (curr_item) {

        curr_item = curr_item.previousElementSibling
        index++
    }
    index--
    return index
}

// ------------ restore ---------
restore = (element) => {

    curr_item = element.parentNode.parentNode.parentNode

    index = getIndex(curr_item)

    curr_input = element.parentNode.parentNode.previousElementSibling

    curr_input.value = text_arr[index]

    element.parentNode.parentNode.classList.replace("flex", "hidden")
    element.parentNode.parentNode.nextElementSibling.classList.replace("hidden", "flex")
}

// ---------  resave  -----------
resave = (element) => {

    curr_item = element.parentNode.parentNode.parentNode

    index = getIndex(curr_item)

    curr_input = element.parentNode.parentNode.previousElementSibling

    text_arr[index] = curr_input.value

    chrome.storage.sync.set({ "text_arr": text_arr }, () => {
        element.parentNode.parentNode.classList.replace("flex", "hidden")
        element.parentNode.parentNode.nextElementSibling.classList.replace("hidden", "flex")
    })
}
// -------- delete function -----------
deleteText = (element) => {
    curr_item = element.parentNode.parentNode.parentNode

    index = getIndex(curr_item)

    text_arr.splice(index, 1)

    chrome.storage.sync.set({ "text_arr": text_arr })

    element.parentNode.parentNode.parentNode.remove()
}



// --------- copy function  ----------
copyText = (element) => {

    text = element.parentNode.parentNode.previousElementSibling.previousElementSibling.value

    navigator.clipboard.writeText(text)
}



// ------ single change --------
singleChange = (li) => {

    let index = getIndex(li)

    btn_list = li.getElementsByTagName("button")

    for (let i = 0; i < btn_list.length; i++) {
        btn_list[i].onclick = (event) => {
            if (i % 5 == 1)
                restore(event.target)
            else if (i % 5 == 3)
                deleteText(event.target)
            else if (i % 5 == 4)
                copyText(event.target)
            else if (i% 5 == 2)
                resave(event.target)
        }
    }

    let input = li.getElementsByTagName("input")[0]

    input.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            resave(event.target.nextElementSibling.firstElementChild.firstElementChild)
        }
        if (input.value != text_arr[index]) {

            input.nextElementSibling.classList.replace("hidden", "flex")

            input.nextElementSibling.nextElementSibling.classList.replace("flex", "hidden")
        }
        else {
            input.nextElementSibling.classList.replace("flex", "hidden")

            input.nextElementSibling.nextElementSibling.classList.replace("hidden", "flex")

        }
    })


    li.firstElementChild.addEventListener("dragstart", (event) => {
        drag(event)
    })
    li.firstElementChild.addEventListener("dragover", (event) => {
        event.preventDefault()
        if (event.target instanceof HTMLButtonElement) {
            drop(event)
        }
    })

}



// ---------- main -----------
chrome.storage.sync.get("text_arr", (target) => {
    if (target.text_arr) {
        text_arr = target.text_arr
    }
    else {
        text_arr = []
    }

    for (i = 0; i < text_arr.length; i++) {
        li = dummy_li.cloneNode(true)
        li.classList.replace("hidden", "flex")
        li.getElementsByTagName("input")[0].value = text_arr[i]
        list.appendChild(li)
    }

    li_list = list.getElementsByTagName("li")

    for (i = 0; i < li_list.length; i++) {
        singleChange(li_list[i])
    }

})


// ------------ add option  -----------
addText = () => {
    text_arr.unshift(text_input.value)
    text_input.value = ""

    chrome.storage.sync.set({ "text_arr": text_arr }, () => {
        li = dummy_li.cloneNode(true)
        li.classList.replace("hidden", "flex")
        li.getElementsByTagName("input")[0].value = text_arr[0]
        list.prepend(li)

        singleChange(li)
    })
}
add_btn.onclick = addText


// ------  enter key listener  ------
text_input.addEventListener("keypress", (target) => {
    if (target.keyCode === 13) {
        add_btn.click()
    }
})


// ----------- reset button ------
reset_btn.addEventListener("click", (event) => {

    reset_undo_btn.classList.replace("hidden", "block")
    reset_btn.classList.replace("block", "hidden")

    let temp_arr = text_arr
    text_arr = []
    chrome.storage.sync.set({ "text_arr": text_arr }, () => {

        curr_elem = list.firstElementChild
        while (curr_elem) {
            curr_elem.remove()
            curr_elem = list.firstElementChild
        }

        let clicked = false
        reset_undo_btn.onclick = () => {
            clicked = true
            reset_undo_btn.onclick = null

            reset_undo_btn.classList.replace("block", "hidden")
            reset_btn.classList.replace("hidden", "block")

            text_arr = temp_arr

            chrome.storage.sync.set({ "text_arr": text_arr }, () => {

                for (i = 0; i < text_arr.length; i++) {
                    li = dummy_li.cloneNode(true)
                    li.classList.replace("hidden", "flex")
                    li.firstElementChild.value = text_arr[i]
                    list.appendChild(li)
                }

                // single change for all
                li_list = list.getElementsByTagName("li")

                for (i = 0; i < li_list.length; i++) {
                    singleChange(li_list[i])
                }
            })
        }

        setTimeout(() => {
            if (!clicked) {
                reset_undo_btn.onclick = null
                reset_undo_btn.classList.replace("block", "hidden")
                reset_btn.classList.replace("hidden", "block")
            }
        }, 3000)



    })
})




// ----- drag -------
drag = (event) => {
    curr_item = event.target.parentNode
    
    let index = getIndex(curr_item)
    drag_index = index
    console.log(index + "XX", event.target)
}


// -------- drop -----------
drop = (event) => {

    let index = drag_index
    

    curr_item = event.target.parentNode
    
    let index2 = getIndex(curr_item)
    if (drop_index == index2) return
    drop_index = index2

    if (index2 == drag_index) return
    
    li = dummy_li.cloneNode(true)
    li.classList.replace("hidden", "flex")
    li.getElementsByTagName("input")[0].value = text_arr
    [drag_index]
    singleChange(li)

    
    if (index2 < index) {
        event.target.parentNode.parentNode.insertBefore(li, event.target.parentNode)

        del_elem = text_arr[index]
        text_arr.splice(index2, 0, del_elem)
        list.getElementsByTagName("li")[index + 1].remove()

        text_arr.splice(index + 1, 1)
        drag_index = drop_index
    }
    else {
        event.target.parentNode.parentNode.insertBefore(li, event.target.parentNode.nextElementSibling)

        del_elem = text_arr[index]
        text_arr.splice(index2 + 1, 0, del_elem)
        list.getElementsByTagName("li")[index].remove()
        text_arr.splice(index, 1)
        drag_index = drop_index
    }
    
    chrome.storage.sync.set({"text_arr": text_arr})

    
    event.preventDefault()
}