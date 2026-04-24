#include <iostream>
#include <vector>

class Stack {
private:
    std::vector<int> elements;
    int capacity;

public:
    Stack(int cap) : capacity(cap) {}

    void push(int value) {
        if (elements.size() >= capacity) {
            std::cout << "Stack Overflow\n";
            return;
        }
        elements.push_back(value);
    }

    void pop() {
        if (elements.empty()) {
            std::cout << "Stack Underflow\n";
            return;
        }
        elements.pop_back();
    }

    int top() {
        if (elements.empty()) {
            return -1;
        }
        return elements.back();
    }

    bool empty() {
        return elements.empty();
    }

    void print() {
        for (int i = elements.size() - 1; i >= 0; i--) {
            std::cout << elements[i] << " ";
        }
        std::cout << "\n";
    }
};

int main() {
    Stack s(15);
    
    s.push(10);
    s.push(20);
    s.push(30);
    
    std::cout << "Stack elements: ";
    s.print();
    
    std::cout << "Top element: " << s.top() << "\n";
    
    s.pop();
    
    std::cout << "Stack after pop: ";
    s.print();
    
    return 0;
}
