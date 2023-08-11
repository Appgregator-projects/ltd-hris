export default function getNestedChildren(arr, parent_id) {
  var out = [];
  for (var i in arr) {
    if (arr[i].parent_id == parent_id) {
      var children = getNestedChildren(arr, arr[i].id);
      if (children.length) {
        arr[i].sub_division = children;
      }
      out.push(arr[i]);
    }
  }
  return out;
}
