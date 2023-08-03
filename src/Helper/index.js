import dayjs from 'dayjs'
// import { ref } from 'firebase/storage'
import { storage } from "../configs/firebase"
import {
    ref,
    uploadBytes,
    getDownloadURL
  } from "firebase/storage"

const dateTimeFormat = (date) => {
    return date ? dayjs(date).format('DD MMM YYYY HH:mm') : '-'
}

const dateFormat = (date) => {
  return date ? dayjs(date).format('DD MMM YYYY') : '-'
}

const fileExtention = (filepath) => {
    return filepath.split("?")[0].split("#")[0].split('.').pop()
}

const upload = (file, name, dir = 'anggaran-new') => {
  const time = new Date().getTime()
  const storageRef = ref(storage, `${dir}/${time}.${fileExtention(name)}`)
  return new Promise((resolve, reject) => {
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          resolve(downloadURL)
        })
      })
      .catch((error) => reject(error.message))
  })
}

const readMore = (val, l = 24) => {
  if (!val) return ""
  val = val.replace(/\s{2,}/g, " ")
  const strLength = val.length
  if (strLength > l) {
    val = `${val.slice(0, l)  }...`
  }
  return val
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase())
}

const capitalize = (val) => {
  if(!val) return ''
  return val.toUpperCase()
}

export {
    dateTimeFormat,
    upload,
    readMore,
    dateFormat,
    capitalize
}