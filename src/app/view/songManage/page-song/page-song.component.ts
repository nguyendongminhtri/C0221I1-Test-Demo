import {Component, OnInit} from '@angular/core';
import {SongService} from '../../../service/song.service';
import {Song} from '../../../model/Song';
import {PageEvent} from '@angular/material/paginator';
import {TokenService} from '../../../service/token.service';

@Component({
  selector: 'app-page-song',
  templateUrl: './page-song.component.html',
  styleUrls: ['./page-song.component.scss']
})
export class PageSongComponent implements OnInit {
  totalElements: number = 0;
  loading: boolean;
  songs: Song[] = [];
  admin: any = ['ADMIN'];
  isCheckAdmin = false;
  deleteSuccess: any = {
    message: "yes"
  }
  status = '';
  constructor(private songService: SongService,
              private tokenService: TokenService) {
  }

  ngOnInit(): void {
    if (JSON.stringify(this.tokenService.getRoles()) == JSON.stringify(this.admin)) {
      this.isCheckAdmin = true;
    }
    this.getListRequest({page: 0, size: 3});
  }

  private getListRequest(request) {
    console.log('request =====>', request);
    // this.loading = true;
    this.songService.pageSong(request).subscribe(data => {
      console.log('data === ', data);
      this.songs = data['content'];
      console.log('data[content] --->', data['content']);
      this.totalElements = data['totalElements'];
      console.log('data[totalElements] --->', data['totalElements']);
      // this.loading = false;
    }, error => {
      // this.loading = false;
    });
  }

  nextPage(event: PageEvent) {
    console.log('event -->', event);
    const request = {};
    request['page'] = event.pageIndex.toString();
    console.log('request[page] = ', event.pageIndex.toString());
    request['size'] = event.pageSize.toString();
    console.log('request[size] = ', request['size']);
    this.getListRequest(request);
  }
  deleteSongById(id: number){
    this.songService.deleteSongById(id).subscribe(data =>{
      if(JSON.stringify(this.deleteSuccess)==JSON.stringify(data)){
        this.status = 'delete Song success!';
        const request = {page: 0, size: 90}
        this.getListRequest(request)
        // window.location.reload();
      }
    })
  }
}
