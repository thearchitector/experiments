#include <stdio.h>
#include <stdint.h>

int main(int argc, char* argv[]) {
  uint_fast8_t flag = 0;

  // run for numbers 1-100
  for(int i = 1; i <= 100; ++i) {
    // special print conditions (Fizz, Buzz, FizzBuzz)
    if(i % 3 == 0 && (flag = 1)) printf("Fizz");
    if(i % 5 == 0 && (flag = 1)) printf("Buzz");
    
    // default case (print the number)
    if(!flag) printf("%d", i);
    printf("\n");
    flag = 0;
  }
}
