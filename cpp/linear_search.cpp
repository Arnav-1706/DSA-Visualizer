#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

int main() {
    std::vector<int> arr = {2, 3, 4, 10, 40};
    int target = 10;
    
    int result = linearSearch(arr, target);
    
    if (result == -1) {
        std::cout << "Element " << target << " is not present in array" << std::endl;
    } else {
        std::cout << "Element " << target << " is present at index " << result << std::endl;
    }
    
    return 0;
}
