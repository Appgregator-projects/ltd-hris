import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat);

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
  try {
    if (!date) return '-'
    const arr = date.split('-')
    const rDate = `${arr[0]}-${arr[1]}-${arr[2].slice(0, 2)}`
    return rDate ? dayjs(rDate).format('DD MMM YYYY') : '-'
  } catch (error) {
    return '-'
  }
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
    val = `${val.slice(0, l)}...`
  }
  return val
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase())
}

const capitalize = (val) => {
  if (!val) return ''
  return val.toUpperCase()
}

const monthName = () => {
  return [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
  ]
}

const mustNumber = () => {
  if (!/\d/.test(event.key) && event.key !== '.' && event.key !== '-') return event.preventDefault()
}

const numberFormat = (value) => {
  if (!value) return '0.00'
  let val = (value / 1)
  val = (value / 1).toFixed(2).replace(',', '.')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

export {
  dateTimeFormat,
  upload,
  readMore,
  dateFormat,
  capitalize,
  monthName,
  mustNumber,
  numberFormat,
  rupiah
}