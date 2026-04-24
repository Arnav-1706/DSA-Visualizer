#include <iostream>
#include <vector>

class Queue {
private:
    std::vector<int> elements;
    int capacity;

public:
    Queue(int cap) : capacity(cap) {}

    void enqueue(int value) {
        if (elements.size() >= capacity) {
            std::cout << "Queue Overflow\n";
            return;
        }
        elements.push_back(value);
    }

    void dequeue() {
        if (elements.empty()) {
            std::cout << "Queue Underflow\n";
            return;
        }
        elements.erase(elements.begin());
    }

    int front() {
        if (elements.empty()) {
            return -1;
        }
        return elements.front();
    }

    bool empty() {
        return elements.empty();
    }

    void print() {
        for (int i = 0; i < elements.size(); i++) {
            std::cout << elements[i] << " ";
        }
        std::cout << "\n";
    }
};

int main() {
    Queue q(15);
    
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    
    std::cout << "Queue elements: ";
    q.print();
    
    std::cout << "Front element: " << q.front() << "\n";
    
    q.dequeue();
    
    std::cout << "Queue after dequeue: ";
    q.print();
    
    return 0;
}
