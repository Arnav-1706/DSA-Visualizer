#include <iostream>
#include <vector>

int binarySearch(const std::vector<int> &arr, int target) {
  int low = 0;
  int high = arr.size() - 1;

  while (low <= high) {
    int mid = low + (high - low) / 2;

    if (arr[mid] == target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}

int main() {
  std::vector<int> arr = {2, 3, 4, 10, 40};
  int target = 10;

  int result = binarySearch(arr, target);

  if (result == -1) {
    std::cout << "Element " << target << " is not present in array"
              << std::endl;
  } else {
    std::cout << "Element " << target << " is present at index " << result
              << std::endl;
  }

  return 0;
}
