import { Directive, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[appRemoveUnderscore]',
  standalone: true
})
export class RemoveUnderscoreDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const value = this.el.nativeElement.value;
    const updatedValue = value.replace(/_/g, ' ');
    this.el.nativeElement.value = updatedValue;
  }

  @HostListener('input' , ['$event.target.value'])

  onInput(value : string){
    const updatedValue = value.replace(/_/g, ' ');
    this.el.nativeElement.value = updatedValue;
  }

}
