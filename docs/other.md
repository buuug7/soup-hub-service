## convention naming

example for photos resource

```
resource: photos
model: Photo
controller: PhotoController
```

## about restful router definition

example for photos resource router defined as below

| Verb      | URI            | Action  | Route Name     |
| --------- | -------------- | ------- | -------------- |
| GET       | /photos        | list    | photos.list    |
| GET       | /photos/:photo | show    | photos.show    |
| POST      | /photos        | create  | photos.create  |
| PUT/PATCH | /photos/:photo | update  | photos.update  |
| DELETE    | /photos/:photo | destroy | photos.destroy |

## pagination

```json
{
  "total": 50,
  "per_page": 15,
  "current_page": 1,
  "last_page": 4,
  "next_page_url": "http://laravel.app?page=2",
  "prev_page_url": null,
  "from": 1,
  "to": 15,
  "data": [{}, {}]
}
```

## default user `master@dev.com` only for test
